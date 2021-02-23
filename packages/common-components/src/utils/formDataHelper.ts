// https://github.com/silkyland/object-to-formdata/blob/master/index.js
// This code adds a handler for arrays of files to be added under the same key

const formDataHelper = (obj: any, formData?: FormData, namespace?: string) => {
  const fd = formData || new FormData()
  let formKey: string

  for (const property in obj) {
    //if (obj.hasOwnProperty(property) && obj[property]) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]"
      } else {
        formKey = property
      }

      if (obj[property] instanceof Date) {
        fd.append(formKey, obj[property].toISOString())
      } else if (
        Array.isArray(obj[property]) &&
        obj[property].every((i: any) => i instanceof File || i instanceof Blob)
      ) {
        const files = obj[property] as Array<File>
        files.forEach(file => {
          fd.append(formKey, file)
        })
      } else if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File) &&
        !(obj[property] instanceof Blob)
      ) {
        formDataHelper(obj[property], fd, formKey)
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property])
      }
    }
  }

  return fd
}

export default formDataHelper
