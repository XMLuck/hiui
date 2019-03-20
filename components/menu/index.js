import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Item from './Item'
import SubMenu from './SubMenu'
import ItemGroup from './ItemGroup'
import './style/index'
class Menu extends Component {
  static defaultProps = {
    mode: 'vertical',
    onClick: () => {},
    activeId: '',
    groupSubMenu: false
  }
  static propTypes = {
    datas: PropTypes.shape({
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      children: PropTypes.array
    }),
    activeId: PropTypes.string,
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    groupSubMenu: PropTypes.bool,
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props)

    const activeIndexs = this.getActiveIndexs(this.props.activeId)

    this.state = {
      activeId: this.props.activeId,
      activeIndexs,
      expandIndexs: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeId !== this.props.activeId) {
      const activeIndexs = this.getActiveIndexs(nextProps.activeId)

      this.setState({
        activeId: nextProps.activeId,
        activeIndexs
      })
    }
  }

  getChildContext () {
    return {
      component: this
    }
  }

  getActiveIndexs (activeId) {
    const {
      datas
    } = this.props
    let activeIndexs = []
    let level = 0

    if (activeId === undefined) {
      return activeIndexs
    }

    const _getActiveIndexs = function (datas) {
      for (const index in datas) {
        const data = datas[index]
        activeIndexs[level] = parseInt(index)
        if (data.children) {
          level++
          _getActiveIndexs(data.children)
        } else if (data.id === activeId) {
          break
        }
      }
    }
    _getActiveIndexs(datas)
    return activeIndexs.join('-')
  }

  onClick (indexs, id) {
    const oldId = this.state.activeId

    this.setState({
      activeIndexs: indexs,
      expandIndexs: ''
    }, () => {
      this.props.onClick(id, oldId)
    })
  }

  onClickSubMenu (indexs) {
    this.setState({
      expandIndexs: indexs
    })
  }

  renderItem (data, indexs, props = {}) {
    const {
      activeIndexs
    } = this.state
    const mergeProps = Object.assign({
      onClick: this.onClick.bind(this),
      id: data.id,
      isActive: activeIndexs.indexOf(indexs) === 0,
      indexs: indexs,
      key: data.id
    }, props)

    return (
      <Item {...mergeProps}>
        {data.content}
      </Item>
    )
  }

  renderGroupSubMenu (datas, indexs) {
    let groups = []

    datas.forEach((data, groupIndex) => {
      groups.push(
        <li className='hi-menu-group' key={groupIndex}>
          <div className='hi-menu-group__title'>
            {data.content}
          </div>
          <ul className='hi-menu-group__content'>
            {
              data.children.map((child, index) => {
                return this.renderItem(child, indexs + '-' + groupIndex + '-' + index)
              })
            }
          </ul>
        </li>
      )
    })
    return groups
  }

  renderMenu (datas, indexs = '') {
    const {groupSubMenu} = this.props
    const {
      activeIndexs,
      expandIndexs
    } = this.state
    let items = []
    const renderMenu = groupSubMenu ? this.renderGroupSubMenu.bind(this) : this.renderMenu.bind(this)

    datas.forEach((data, index) => {
      const indexStr = indexs !== '' ? indexs + '-' + index : '' + index
      if (data.children) {
        items.push(
          <SubMenu
            onClick={this.onClickSubMenu.bind(this)}
            indexs={indexStr}
            groupSubMenu={groupSubMenu}
            isActive={activeIndexs.indexOf(indexStr) === 0}
            isExpand={expandIndexs.indexOf(indexStr) === 0}
            content={data.content}
            renderMenu={renderMenu}
            datas={data.children}
          />
        )
      } else {
        items.push(this.renderItem(data, indexStr))
      }
    })

    return items
  }

  render () {
    const {datas, mode} = this.props
    const cls = classNames('hi-menu', `hi-menu-${mode}`)

    return (
      <div className={cls}>
        <ul className='hi-menu-items'>
          { this.renderMenu(datas) }
        </ul>
      </div>
    )
  }
}
Menu.childContextTypes = {
  component: PropTypes.any
}

Menu.Item = Item
Menu.SubMenu = SubMenu
Menu.ItemGroup = ItemGroup
export default Menu
