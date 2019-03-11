import React from 'react'
import { mount } from 'enzyme'
import Tabs from '../'
import Icon from '../../icon'

let wrapper
const clickCallback = jest.fn(items => items)
const editCallback = jest.fn((action, index, tabKey) => {})
class EditableTabs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      panes: [
        {
          tabName: '我的订单',
          tabKey: 'tabKey-1'
        },
        {
          tabName: '团购订单',
          tabKey: 'tabKey-2',
          closable: false
        },
        {
          tabName: '以旧换新订单',
          tabKey: 'tabKey-3'
        },
        {
          tabName: '消息通知',
          tabKey: 'tabKey-4'
        }
      ]
    }
  }

  onEdit (action, index, tabKey) {
    this[`${action}Tab`](index, tabKey)
  }

  addTab () {
    const panes = this.state.panes

    this.setState({
      panes: panes.concat([{
        tabName: `新增标签${panes.length + 1}`,
        tabKey: `tabKey-${panes.length + 1}`
      }])
    })
  }

  deleteTab (index, tabKey) {
    const panes = this.state.panes.slice()
    panes.splice(index, 1)

    this.setState({
      panes
    })
  }

  render () {
    return (
      <div>
        <Tabs type="editable" activeTabKey="1" onTabClick={clickCallback} editable onEdit={this.onEdit.bind(this)}>
          {
            this.state.panes.map((pane, index) => {
              return (
                <Tabs.Pane
                  tabName={pane.tabName}
                  tabKey={pane.tabKey}
                  closable={pane.closable}
                  key={index}
                >
                  <div style={{padding: '16px'}}>{pane.tabName}</div>
                </Tabs.Pane>
              )
            })
          }
        </Tabs>
      </div>
    )
  }
}

describe('Tabs', () => {
  afterEach(() => {
    wrapper && wrapper.unmount()
    clickCallback.mockClear()
    editCallback.mockClear()
  })

  it('卡片式标签', () => {
    const panes = [
      {
        tabName: '我的订单',
        tabKey: 'tabKey-1'
      },
      {
        tabName: '团购订单',
        tabKey: 'tabKey-2',
        closable: false
      },
      {
        tabName: '以旧换新订单',
        tabKey: 'tabKey-3'
      },
      {
        tabName: <span><Icon name="chat-group" />消息通知</span>,
        tabKey: 'tabKey-4'
      },
      {
        tabName: '购买资格',
        tabKey: 'tabKey-5'
      },
      {
        tabName: '团购通知',
        tabKey: 'tabKey-6'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-7'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-8'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-9'
      },
      {
        tabName: '订单详情',
        tabKey: 'tabKey-10'
      }
    ]
    wrapper = mount(
      <Tabs activeTabKey="1" onTabClick={clickCallback}>
        {
          panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabName={pane.tabName}
                tabKey={pane.tabKey}
                closable={pane.closable}
                key={index}
              >
                <div style={{padding: '16px'}}>{pane.tabName}</div>
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    )
    // 默认激活项
    expect(wrapper.state().activeKey).toEqual('tabKey-1')
    expect(wrapper.find('.hi-tabs-pane').at(0).props().style.display).toEqual(undefined)

    // 展开更多项
    wrapper.find('.hi-tabs-dropdown__toggle').simulate('click')
    expect(document.querySelectorAll('.hi-tabs-dropdown__item')).toHaveLength(4)

    // 选中更多项里面的子项目
    document.querySelector('.hi-tabs-dropdown__item').click()
    expect(wrapper.state().activeKey).toEqual('tabKey-7')
    expect(clickCallback).toHaveBeenCalledTimes(1)

    // 选中非更多项里面的项目
    wrapper.find('.hi-tabs__item').at(3).simulate('click')
    expect(wrapper.state().activeKey).toEqual('tabKey-4')
    expect(clickCallback).toHaveBeenCalledTimes(2)
  })

  it('新增和关闭标签', () => {
    wrapper = mount(<EditableTabs/>)
    // 默认激活项
    expect(wrapper.find('Tabs').state().activeKey).toEqual('tabKey-1')
    expect(wrapper.find('.hi-tabs-pane').at(0).props().style.display).toEqual(undefined)
    expect(wrapper.find('Tabs').state().showTabItems).toHaveLength(4)

    // 新增tab
    wrapper.find('.hi-tabs__add').find('Icon').simulate('click')
    expect(wrapper.find('Tabs').state().showTabItems).toHaveLength(5)

    // 删除tab
    wrapper.find('.hi-tabs__item-close').at(0).find('Icon').simulate('click')
    expect(wrapper.find('Tabs').state().showTabItems).toHaveLength(4)
    expect(wrapper.find('Tabs').state().activeKey).toEqual('tabKey-2')

    // closable: false不可删除
    expect(wrapper.find('.hi-tabs__item').at(0).find('.hi-tabs__item-close')).toHaveLength(0)

    // 选中tab
    wrapper.find('.hi-tabs__item').at(1).simulate('click')
    expect(wrapper.find('Tabs').state().activeKey).toEqual('tabKey-3')
    expect(clickCallback).toHaveBeenCalledTimes(1)
  })

  it('竖直标签', () => {
    const panes = [
      {
        tabName: '我的订单',
        tabKey: 'tabKey-1',
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '团购订单',
        tabKey: 'tabKey-2',
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '以旧换新订单',
        tabKey: 'tabKey-3',
        tabDesc: '关于标签的描述信息'
      },
      {
        tabName: '消息通知',
        tabKey: 'tabKey-4',
        tabDesc: '关于标签的描述信息'
      }
    ]
    wrapper = mount(
      <Tabs type="desc" activeTabKey="1" onTabClick={clickCallback}>
        {
          panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabName={pane.tabName}
                tabDesc={pane.tabDesc}
                tabKey={pane.tabKey}
                closable={pane.closable}
                key={index}
              >
                <div style={{padding: '16px'}}>{pane.tabName}</div>
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    )

    // 默认激活项
    expect(wrapper.state().activeKey).toEqual('tabKey-1')
    expect(wrapper.find('.hi-tabs-pane').at(0).props().style.display).toEqual(undefined)

    // 选中tab
    wrapper.find('.hi-tabs__item').at(3).simulate('click')
    expect(wrapper.state().activeKey).toEqual('tabKey-4')
    expect(clickCallback).toHaveBeenCalledTimes(1)
  })

  it('按钮式标签', () => {
    const panes = [
      {
        tabName: '我的订单',
        tabKey: 'tabKey-1'
      },
      {
        tabName: '团购订单',
        tabKey: 'tabKey-2'
      },
      {
        tabName: '以旧换新订单',
        tabKey: 'tabKey-3'
      },
      {
        tabName: '消息通知',
        tabKey: 'tabKey-4'
      }
    ]
    wrapper = mount(
      <Tabs type="button" activeTabKey="1" onTabClick={clickCallback}>
        {
          panes.map((pane, index) => {
            return (
              <Tabs.Pane
                tabName={pane.tabName}
                tabKey={pane.tabKey}
                closable={pane.closable}
                key={index}
              >
                <div style={{padding: '16px'}}>{pane.tabName}</div>
              </Tabs.Pane>
            )
          })
        }
      </Tabs>
    )

    // 默认激活项
    expect(wrapper.state().activeKey).toEqual('tabKey-1')
    expect(wrapper.find('.hi-tabs-pane').at(0).props().style.display).toEqual(undefined)

    // 选中tab
    wrapper.find('.hi-tabs__item').at(3).simulate('click')
    expect(wrapper.state().activeKey).toEqual('tabKey-4')
    expect(clickCallback).toHaveBeenCalledTimes(1)
  })
})
