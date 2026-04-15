class Disease {
  constructor({
    disease_id,
    name,
    category,
    description,
    symptoms,
    treatment,
    image_url,
    created_at,
    updated_at,
  }) {
    this.disease_id = disease_id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.symptoms = symptoms;
    this.treatment = treatment;
    this.image_url = image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = { Disease };
