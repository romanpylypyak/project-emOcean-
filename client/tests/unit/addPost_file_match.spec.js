import { shallowMount } from '@vue/test-utils'
import AddPost from '@/views/Feed/AddPost.vue'

let wrapper
beforeEach(() => {
  wrapper = shallowMount(AddPost)
})

describe('AddPost.vue', () => {
  it("Check if component renders", () => {
    expect(wrapper.exists()).toBe(true)
  })
  it('Check if function "showNotif" consist', () => {
    expect(typeof AddPost.methods.showNotif).toBe('function')
  })
  it('Check if function "addToFeed" consist', () => {
    expect(typeof AddPost.methods.addToFeed).toBe('function')
  })
  it('Check if object "post" consist in data', () => {
    const Data = AddPost.data()
    expect(typeof Data.post).toBe('object')
  })
  it('Check if function "uploadVideo" is defined', () => {
    const uploadVideo = AddPost.methods.uploadVideo
    expect(uploadVideo()).toBeDefined()
  })
})
