const genUid = () => {
  let uid =
    'u' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(26).slice(2) +
    '-' +
    Math.random().toString(36).slice(2) +
    '-' +
    Math.random().toString(36).slice(2);

  const setUid = () => {
    if (uid.length < 45) {
      uid += uid.split('')[2];
      setUid();
    } else if (uid.length > 45) {
      const arr = uid.split('');
      arr.pop();
      uid = arr.join('');
      setUid();
    }
  };

  setUid();

  return uid;
};

export default genUid;
