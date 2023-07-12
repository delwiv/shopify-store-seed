export const buildLink = (data) => {
  let result;
  try {
    if (data.reference._type.includes('page')) {
      result = `/pages/${data.reference.slug.current}`;
    } else {
      result = '/'.concat(
        [`${data.reference._type}s`, data.reference.store.slug.current].join(
          '/',
        ),
      );
    }
    return result;
  } catch (err) {
    console.warn('could not build link for this input', data, err);
    return '';
  }
};
