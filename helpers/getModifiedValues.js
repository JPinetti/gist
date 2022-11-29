export const getModifiedValues = (values) => {
  const documents = values.documents.map((item) => item.id);

  return { ...values, documents };
};
