const baseUrl = import.meta.env.VITE_API_URL;

export const apiClient = async (path: string, options?: RequestInit) =>{
    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {})
        }
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
};