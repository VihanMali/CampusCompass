export function createDraft(college) {
  return {
    id: null,
    name: college.name,
    shortName: null,
    city: college.city,
    state: college.state,
    type: null,
    website: null,
    description: college.description,

    center: {
      lat: college.center.lat,
      lng: college.center.lng
    },

    courses: [],
    boundary: [],
    locations: []
  };

}