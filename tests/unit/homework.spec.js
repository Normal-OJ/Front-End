import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ShowHomework from '@/components/courses/ShowHomework.vue'
import UiButton from '@/components/ui/UiButton.vue'

describe('ShowHomework.vue', () => {
  // mock data
  const propsData = {
    user: 'test_user',
    items: [
      {
        content: 'just for test',
        edStamp: 1635998400000,
        end: '2021/11/04 12:00:00',
        id: '615ab89e3b43dc5ec8b9dc90',
        problemIds: [1, 2, 3],
        scoreboardStatus: undefined,
        stStamp: 1633320000000,
        start: '2021/10/04 12:00:00',
        status: 'Running',
        studentStatus: {
          student1: {
            problemStatus: -1,
            score: 0,
            submissionIds: []
          }
        },
        title: 'test_hw'
      },
      {
        content: 'just for test2',
        edStamp: 1635998400000,
        end: '2021/11/04 12:00:00',
        id: '615ab89e3b43dc5ec8b9dc91',
        problemIds: [4, 5, 6],
        scoreboardStatus: undefined,
        stStamp: 1633320000000,
        start: '2021/10/04 12:00:00',
        status: 'Running',
        studentStatus: {
          student1: {
            problemStatus: -1,
            score: 0,
            submissionIds: []
          }
        },
        title: 'test_hw2'
      }
    ],
    probs: [{
      ACUser: 0,
      displayedName: '1 - HW #0 pA',
      problemId: 1,
      problemName: 'HW #0 pA',
      quota: -1,
      status: 0,
      submitCount: 0,
      submitter: 0
    }],
    perm: true
  }

  // test setup
  const localVue = createLocalVue()
  localVue.component('ui-button', UiButton)
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountFunc = options => shallowMount(ShowHomework, {
    localVue,
    vuetify,
    propsData,
    ...options
  })

  // view test
  it('should have title', () => {
    const wrapper = mountFunc()
    const title = wrapper.find('[data-test=title]')
    expect(title.text()).toMatch(propsData.items[0].title)
  })

  it('should have status tag', () => {
    const wrapper = mountFunc()
    const statusTag = wrapper.find('[data-test=hw-status]')
    expect(statusTag.text()).toMatch(propsData.items[0].status)
  })

  it('should have Due time', () => {
    const wrapper = mountFunc()
    const dueTime = wrapper.find('[data-test=due-time]')
    expect(dueTime.text()).toMatch(propsData.items[0].end)
  })

  it('should have exists markdown description', () => {
    const wrapper = mountFunc()
    const markdown = wrapper.find('[data-test=markdown]')
    expect(markdown.exists()).toBeTruthy()
  })

  it('should have problem info', () => {
    const wrapper = mountFunc()
    const table = wrapper.find('[data-test=problem-table]')
    expect(table.exists()).toBeTruthy()
  })

  it('should have button and redirect to handwritten page after click ', () => {
    const wrapper = mountFunc()
    const handwritten = wrapper.find('[data-test=handwritten]')
    expect(handwritten.exists()).toBeTruthy()
  })

  it('should have student status button', () => {
    const wrapper = mountFunc()
    const studentSatus = wrapper.find('[data-test=student-status]')
    expect(studentSatus.exists()).toBeTruthy()
  })

  // logic test
  it.each([[0], [1]])('edit should pass correct course id', async (selectInd) => {
    const wrapper = mountFunc()
    // select the edit button
    const menuItem = wrapper.findAll('[data-test=menu]').at(selectInd).findAll('[data-test=menu-item]').at(0)
    await menuItem.trigger('click')
    await wrapper.vm.$nextTick()
    // index should be correct
    expect(wrapper.vm.menu.i).toEqual(selectInd)
    // hwId should be correct
    expect(wrapper.vm.menu.id).toEqual(propsData.items[selectInd].id)
    // 'edit' should be emmited
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([selectInd, propsData.items[selectInd].id])
  })
})
