export const fetchBase = async () => {
  try {
    const response = await fetch(
      'https://apps.mediasoft.ru/flask/test/base',

      {
        method: 'GET',
        credentials: 'include', // Если необходимо отправлять куки
      }
    );
    if (!response.ok) {
      throw new Error('Ошибка при получении персонала');
    }
    const data = await response.json();

    return data; // Предполагается, что сервер возвращает массив объектов с id и name
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPersonal = async () => {
  try {
    const response = await fetch(
      'https://apps.mediasoft.ru/flask/test/personal',
      {
        credentials: 'include', // Если необходимо отправлять куки
      }
    );
    if (!response.ok) {
      throw new Error('Ошибка при получении персонала');
    }
    const data = await response.json();

    return data; // Предполагается, что сервер возвращает массив объектов с id и name
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchProjects = async () => {
  try {
    const response = await fetch(
      'https://apps.mediasoft.ru/flask/test/project',
      {
        credentials: 'include', // Если необходимо отправлять куки
      }
    );
    if (!response.ok) {
      throw new Error('Ошибка при получении проектов');
    }
    const data = await response.json();
    return data; // Предполагается, что сервер возвращает массив объектов с id и name
  } catch (error) {
    console.error(error);
    return [];
  }
};
