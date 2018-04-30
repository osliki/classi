const actions = {
  increment: ({ count }) => ({ count: count + 1 }),
  getCats: async ({ contract, catsCount, cats }) => {
    const freshCatsCount = await contract.methods.getCatsCount()
    if (freshCatsCount === catsCount) {
      return { cats }
    } else {

      //const freshCatsCount = await contract.methods.getCatsCount()
    }
  }
}

export default actions
