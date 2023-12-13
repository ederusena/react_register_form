import { v4 as uuidv4 } from 'uuid';

const useUUID = () => {
  const generateUUID = () => {
    return uuidv4();
  };

  return generateUUID;
};

export default useUUID;
