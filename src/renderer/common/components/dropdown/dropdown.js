import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Styles from "./dropdown.styles.less";
import { css } from 'glamor';
import spring, { toString } from 'css-spring'
import styled, { keyframes } from 'styled-components'


// pass in how options will be rendered in array of html, network dropdown will change default menu label, need a line break option
class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showList: false,
    };

    this.toggleList = this.toggleList.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  toggleList() {
    this.props.setMenuIsOpen && this.props.setMenuIsOpen(!this.state.showList);
    this.setState({ showList: !this.state.showList });
  }

  handleWindowOnClick(event) {
    const modal = document.getElementById('modal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');

    if (modal && editModal) {
      if (event.target === modal || modal.contains(event.target) ||
        event.target === editModal || editModal.contains(event.target)) {
        return;
      }
    } else if (modal && deleteModal) {
      if (event.target === modal || modal.contains(event.target) ||
        event.target === deleteModal || deleteModal.contains(event.target)) {
        return;
      }
    }
    
    if (this.refDropdown && !this.refDropdown.contains(event.target) || 
      this.refDropdownItems && this.refDropdownItems.contains(event.target)) {
      this.setState({ showList: false });
      this.props.setMenuIsOpen &&  this.props.setMenuIsOpen(false);
    }
  }

  render() {
    const { options, big } = this.props;
    
    // const springLeft = css.keyframes('springLeft', spring(
    //   { maxHeight: '0px' }, { maxHeight: '530px' }, { preset: 'gentle', damping: '.8' }
    // ));
    const springLeft = toString(spring(
      { height: '0px' }, { height: '508px' }, { preset: 'wobbly' }
    ))

    console.log(springLeft)
    const styleProp = {
      animation: `${keyframes`${springLeft}`} 1000ms ease 1`,
      border: '2px',
    }
    console.log(styleProp)

    return (
      <div
        className={Styles.Dropdown}
        ref={dropdown => {
          this.refDropdown = dropdown;
        }}
      >
        <div className={Styles.Dropdown__label} onClick={this.toggleList}>
          {this.props.button}
        </div>
 {this.state.showList ? 
     <div 
          className={classNames(Styles.Dropdown__menu, {
             [Styles['Dropdown__menuBig']]: big,
             [Styles['Dropdown__menu-visible']]: this.state.showList && !big,
             [Styles['Dropdown__menuBig-visible']]: this.state.showList && big,
          })}
          ref={dropdownItems => {
            this.refDropdownItems = dropdownItems;
          }}
          style={styleProp}
        >
          {this.props.children}
        </div>
        : null}
       
      </div>
    );
  }
}

Dropdown.propTypes = {
  button: PropTypes.array.isRequired,
  setMenuIsOpen: PropTypes.func,
  big: PropTypes.bool,
};

export default Dropdown;
