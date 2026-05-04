import { getApiUrl } from './api-config'
import { FileInfo, Chat } from './types'
import { useStore } from './store'

/**
 * API service for communicating with the backend
 */

// Create a new chat
export const createChat = async (): Promise<{ id: string }> => {
  const response = await fetch(getApiUrl('/chats'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      title: `New Chat`,
      forceCreate: true // Add this flag to force creation of a new chat
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create chat: ${response.statusText}`)
  }

  // Get the response data
  const data = await response.json()
  
  // When the backend returns an existing chat, it will have an ID
  // Convert the numeric ID to string (as the frontend uses string IDs)
  return { id: data.id.toString() }
}

// Get all chats
export const getChats = async (): Promise<Chat[]> => {
  try {
    const response = await fetch(getApiUrl('/chats'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get chats: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Convert numeric IDs to strings for frontend consistency
    return data.map((chat: any) => ({
      ...chat,
      id: chat.id.toString(),
      name: chat.title,
      messages: chat.messages?.map((msg: any) => ({
        id: msg.id.toString(),
        role: msg.role,
        content: msg.content
      })) || []
    }));
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

// Get a single chat
export const getChat = async (chatId: string): Promise<Chat | null> => {
  try {
    const response = await fetch(getApiUrl(`/chats/${chatId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get chat: ${response.statusText}`);
    }

    const data = await response.json();
    
    // When loading a chat, tell the backend to reset its context for this chat
    try {
      await fetch(getApiUrl(`/chats/${chatId}/reset-context`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id: chatId })
      });
    } catch (error) {
      console.error(`Failed to reset context for chat ID: ${chatId}`, error);
    }
    
    // Convert numeric ID to string and map messages safely
    return {
      ...data,
      id: data.id.toString(),
      name: data.title,
      messages: data.messages?.map((msg: any) => ({
        id: msg.id.toString(),
        role: msg.role,
        content: msg.content
      })) || []
    };
  } catch (error) {
    console.error(`Error fetching chat ${chatId}:`, error);
    throw error;
  }
}

// Delete a chat
export const deleteChat = async (chatId: string) => {
  const response = await fetch(getApiUrl(`/chats/${chatId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete chat: ${response.statusText}`)
  }

  // Return successful deletion (HTTP 204 returns no content)
  return { success: true }
}

// Rename a chat
export const renameChat = async (chatId: string, name: string) => {
  const response = await fetch(getApiUrl(`/chats/${chatId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: name }),
  })

  if (!response.ok) {
    throw new Error(`Failed to rename chat: ${response.statusText}`)
  }

  const chat = await response.json()
  
  // Convert numeric ID to string for frontend consistency
  return {
    ...chat,
    id: chat.id.toString()
  }
}

// Upload a file
export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData()
  formData.append('file', file)

  let response: Response;
  try {
    response = await fetch(getApiUrl('/files/upload'), {
      method: 'POST',
      body: formData,
    });
  } catch (networkError) {
    console.error('Network error during file upload:', networkError);
    throw new Error('Network error: Failed to connect to server for file upload.');
  }

  if (!response.ok) {
    let errorMessage = `Failed to upload file: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.detail) {
        errorMessage = errorData.detail; 
      }
    } catch (jsonError) {
      console.error('Could not parse error response from uploadFile:', jsonError);
    }
    console.error('File upload failed with status:', response.status, 'Message:', errorMessage);
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    console.error('Error parsing JSON response from successful file upload:', jsonError);
    throw new Error('Received an invalid response from the server after file upload.');
  }
}

// Send a message with streaming response
export const streamChatMessage = async (
  chatId: string,
  message: string,
  files?: File[],
  onChunk?: (chunk: string) => void,
  onError?: (error: Error) => void,
  onDone?: () => void
) => {
  let fileIds: string[] = [];
  const abortController = new AbortController();

  try {
    if (files && files.length > 0) {
      for (const f of files) {
        try {
          const fileInfo = await uploadFile(f);
          fileIds.push(fileInfo.file_id);
        } catch (uploadError: any) {
          console.error('Error uploading file within streamChatMessage:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown file upload error';
          onError?.(new Error(errorMessage));
          return;
        }
      }
    }

    const requestBody: { content?: string; file_ids?: string[] } = {};
    if (message) {
      requestBody.content = message; 
    }
    if (fileIds.length > 0) {
      requestBody.file_ids = fileIds;
    }

    if (!requestBody.content && (!requestBody.file_ids || requestBody.file_ids.length === 0)) {
        const noContentError = new Error('No message content or file provided.');
        console.error(noContentError.message);
        onError?.(noContentError);
        return;
    }

    const response = await fetch(getApiUrl(`/chat/${chatId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Client': 'troubleshooting-stream',
        'X-Chat-Context': 'keep', 
        'X-Generation-Id': 'unknown', 
      },
      body: JSON.stringify(requestBody),
      signal: abortController.signal,
    });

    if (!response.ok) {
      let errorDetail = `Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          errorDetail = errorData.detail;
        }
      } catch (e) { }
      throw new Error(errorDetail); 
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available for stream'); 
    }

    const processStream = async () => {
      const decoder = new TextDecoder()
      let buffer = ''
      let streamActive = true;
      let accumulatedText = '';
      
      try {
        while (streamActive) {
          if (abortController.signal.aborted) {
            break;
          }
          const { done, value } = await reader.read()
          
          if (done) {
            streamActive = false;
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            if (!line.trim()) continue
            
            if (line.startsWith('data: ')) {
              try {
                const dataContent = line.substring(6);
                
                if (dataContent === '[DONE]') {
                  onDone?.();
                  streamActive = false;
                  break;
                }
                
                try {
                  const data = JSON.parse(dataContent);
                  
                  if (data.generation_id) {
                    continue;
                  }
                  
                  if (data.text) {
                    const textChunk = data.text;
                    accumulatedText += textChunk;
                    
                    if (!abortController.signal.aborted) {
                      onChunk?.(textChunk);
                    }
                    continue;
                  }
                  
                  if (data.error) {
                    const errorMsg = data.text || data.error;
                    onError?.(new Error(errorMsg));
                    continue;
                  }
                } catch (parseError) {
                  if (!abortController.signal.aborted) {
                    onChunk?.(dataContent);
                  }
                }
              } catch (processingError) {
                console.error('Error processing data line:', processingError, 'Line:', line);
              }
            } else if (line.startsWith(':')) {
              continue;
            }
          }
        }
      } catch (error) {
        if ((error as any)?.name === 'AbortError') {
          return;
        }
        onError?.(error instanceof Error ? error : new Error(String(error)));
      } finally {
        try {
          await reader.cancel();
        } catch (e) {
          const err = e as Error;
          if (!(err instanceof DOMException && err.name === 'AbortError')) {
            console.warn('Error closing reader:', err);
          }
        }
        onDone?.();
      }
    }
    
    return processStream().catch(error => {
      if ((error as any)?.name === 'AbortError') {
        return;
      }
      console.error('Unhandled error in processStream:', error);
      onError?.(error instanceof Error ? error : new Error('Unhandled stream processing error'));
    });
  } catch (error: any) {
    if ((error as any)?.name === 'AbortError') {
      return;
    }
    console.error('Error in streamChatMessage main try-catch:', error);
    onError?.(error instanceof Error ? error : new Error('An unexpected error occurred during chat streaming.'));
  }
}

// Speech to text conversion
export const speechToText = async (audioBlob: Blob): Promise<{ text: string }> => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')

  const response = await fetch(getApiUrl('/stt'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to convert speech to text: ${response.statusText}`)
  }

  return response.json()
}

// Interrupt a running generation
export const interruptGeneration = async (generationId: string, chatId: string) => {
  const url = getApiUrl(`/chats/${chatId}/interrupt?generation_id=${encodeURIComponent(generationId)}`);
  const response = await fetch(url, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Failed to interrupt generation: ${response.statusText}`);
  }
  return response.json();
}