function required (fields, object) {
  let errors = {}
  fields.forEach(field => {
    if (!object[field]) errors[field] = `Campo '${field}' é obrigatório.`
  })
  return errors
}

module.exports = {
  required
}
