export const API = 'http://localhost:9000/api';

export const testApi = async (): Promise<string> => {
    const response = await fetch(`${API}/maint/test`);
    return response.json();
};
