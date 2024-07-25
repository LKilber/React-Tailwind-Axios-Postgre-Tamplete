import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSchoolGroups = (user) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(
            'http://127.0.0.1:8000/demand/pricing-groups/',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setGroups(response.data);
        } catch (error) {
          console.error('There was an error fetching the groups!', error);
        }
      }
    };

    fetchGroups();
  }, [user]);

  return groups;
};

export default useFetchSchoolGroups;
