const list_helpers = require('../utils/list_helpers')

test('dummy return one',() => {
    const blogs = []

    const res = list_helpers.dummy(blogs)
    expect(res).toBe(1)
})
