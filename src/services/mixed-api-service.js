import config from '../config';
import TokenService from './token-service';

const MixedApiService = {
  getClassesAndGroupingsForTeacher() {
    return Promise.all([
      fetch(`${config.API_ENDPOINT}/classes/teacher`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      }),
      fetch(`${config.API_ENDPOINT}/groupings/teacher`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
    ])
      .then(([classesRes, groupingsRes]) => {
        if (!classesRes.ok) {
          return classesRes.json()
            .then((error) => Promise.reject(error));
        }
        if (!groupingsRes.ok) {
          return groupingsRes.json()
            .then((error) => Promise.reject(error));
        }
        return Promise.all([classesRes.json(), groupingsRes.json()]);
      });
  },
  getClassesForTeacher() {
    return fetch(`${config.API_ENDPOINT}/classes/teacher`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      });
  },
  insertNewClass(newClassName) {
    return fetch(`${config.API_ENDPOINT}/classes`, {
      method: 'POST',
      body: JSON.stringify({
        class_name: newClassName
      }),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
        return res.json();
      });
  },
  insertNewGrouping(newGrouping) {
    return fetch(`${config.API_ENDPOINT}/groupings`, {
      method: 'POST',
      body: JSON.stringify(newGrouping),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
        return res.json();
      });
  },
  editClass(classId, updatedClassName) {
    return fetch(`${config.API_ENDPOINT}/classes/${classId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        class_name: updatedClassName
      }),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
      });
  },
  editGrouping(updatedGrouping) {
    return fetch(`${config.API_ENDPOINT}/groupings/${updatedGrouping.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedGrouping),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
      });
  },
  deleteClass(classId) {
    return fetch(`${config.API_ENDPOINT}/classes/${classId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
      });
  },
  deleteGrouping(groupingId) {
    return fetch(`${config.API_ENDPOINT}/groupings/${groupingId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw error;
          });
        }
      });
  }
};

export default MixedApiService;
