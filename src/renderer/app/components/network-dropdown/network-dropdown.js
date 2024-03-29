import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Dropdown from "../../../common/components/dropdown/dropdown";
import ChevronFlip from "../../../common/components/chevron-flip/chevron-flip";
import DropdownStyles from "../../../common/components/dropdown/dropdown.styles.less";
import Styles from './network-dropdown.styles.less'

class NetworkDropdownItems extends Component {
	static propTypes = {
	    selectNetwork: PropTypes.func.isRequired, 
	    renderCircle: PropTypes.func.isRequired, 
	    isSelected: PropTypes.bool,
	    networkName: PropTypes.string.isRequired,
	};
	render() {
		return (
			<div
              className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem)}
              onClick={this.props.selectNetwork}
            >
              {this.props.renderCircle(this.props.isSelected)}
              <div className={Styles.NetworkDropdown__name}>{this.props.networkName}</div>
            </div>
		)
	}
}

export class NetworkDropdown extends Component {
	static propTypes = {
	    connections: PropTypes.object.isRequired,
	    updateModal: PropTypes.func.isRequired,
	    updateSelectedConnection: PropTypes.func.isRequired,
	    isConnectedPressed: PropTypes.bool,
	    openBrowserEnabled: PropTypes.bool,
	    stopServer: PropTypes.func.isRequired,
	    animateKey: PropTypes.string,
	    updateConfig: PropTypes.func.isRequired,
	    selectedKey: PropTypes.string.isRequired,
	    connected: PropTypes.bool,
	};

	constructor(props) {
	    super(props);

	    this.state = {
	      menuIsOpen: false,
	    };

	    this.addNew = this.addNew.bind(this);
	    this.setMenuIsOpen = this.setMenuIsOpen.bind(this);
	    this.renderCircle = this.renderCircle.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.animateKey !== this.props.animateKey) {
			setTimeout(() => {
		      this.props.updateConfig({animateKey: ''})
		    }, 300)
		}
	}

	selectNetwork(networkId) {
		const {
			selectedKey,
			updateSelectedConnection,
			stopServer,
			isConnectedPressed,
		} = this.props
		console.log(networkId)

	    if (selectedKey !== networkId) {
	      updateSelectedConnection(networkId)
          this.setState({menuIsOpen: false})
          stopServer();
	    }
	}

	setMenuIsOpen(value) {
	    document.body.style.overflowY = value ? "hidden" : "visible"; 
		this.setState({menuIsOpen: value})
	}

	addNew(e) {
		this.props.updateModal();
		e.stopPropagation();
	}

	editConnection(connection, key, e) {
		connection.key = key
		this.props.updateModal({initialConnection: connection})
		e.stopPropagation();
	}

	renderCircle(isSelected) {
		const {
  			isConnectedPressed,
  			openBrowserEnabled,
  			connected,
  		} = this.props

		return (
			<div
        		className={classNames(Styles.NetworkDropdown__circle, Styles['NetworkDropdown__circle-big'], {
        			[Styles['NetworkDropdown__circle-blue']]: isSelected && ((isConnectedPressed && !openBrowserEnabled) || connected),
       				[Styles['NetworkDropdown__circle-green']]: isSelected && openBrowserEnabled
   				})}
    		/>
		)
	}

  	render() {
  		const {
  			connections,
  			isConnectedPressed,
  			openBrowserEnabled,
  			animateKey,
  			selectedKey,
  			connected,
  		} = this.props

	  	let options = []
	  	let userCreatedOptions = []
	  	let end = [];

	  	for (let key in connections) {
	  		const isSelected = (key === selectedKey)
	  		if (connections[key].userCreated) {
	  			userCreatedOptions.push(
		  			<div
		              key={key}
		              className={
		              	classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem,
		              		{
					        	[Styles['NetworkDropdown__menuItem-hidden']]: animateKey === key,
					        }
		           		)
		              }
		              onClick={this.selectNetwork.bind(this, key)}
		            >
		              {this.renderCircle(isSelected)}
		              <div className={Styles.NetworkDropdown__name}>{connections[key].name}</div>
	              	  <div onClick={this.editConnection.bind(this, connections[key], key)} className={Styles.NetworkDropdown__editButton} />
		            </div>
	  			)
	  		} else {
	  			if (key === 'mainnet') {
	  				options.unshift(
	  					<NetworkDropdownItems
	  						key={key}
	  						selectNetwork={() => {
					        	this.selectNetwork(key);
					        }}
	  						renderCircle={this.renderCircle}
	  						isSelected={isSelected}
	  						networkName={connections[key].name}
	  					/>
	  				);
	  			} else if (key === 'local' || key === 'localLightNode') { 
	  				end.push(key)
	  			} else {
	  				options.push(
	  					<NetworkDropdownItems
	  						key={key}
	  						selectNetwork={() => {
					        	this.selectNetwork(key);
					        }}
	  						renderCircle={this.renderCircle}
	  						isSelected={isSelected}
	  						networkName={connections[key].name}
	  					/>
	  				);
	  			}	
		  	}
	  	}

		for (let i = 0; i < end.length; i++) {
	  		const key = end[i]
	  		const isSelected = (key === selectedKey)
	  		options.unshift(
	  			<NetworkDropdownItems
					key={key}
					selectNetwork={() => {
		        		this.selectNetwork(key);
		        	}}
					renderCircle={this.renderCircle}
					isSelected={isSelected}
					networkName={connections[key].name}
				/>
	  		)
	  	}

	  	return (
	  		<section className={Styles.NetworkDropdown}>
		        <Dropdown big setMenuIsOpen={this.setMenuIsOpen}
		        	button={
			        	[
			        		<div key="0" className={classNames(Styles.NetworkDropdown__label, {
		               				[Styles['NetworkDropdown__label-open']]: this.state.menuIsOpen
		           				})}>
				        		<div
					        		className={classNames(Styles.NetworkDropdown__circle, {
					        			[Styles['NetworkDropdown__circle-blue']]: (isConnectedPressed && !openBrowserEnabled) || connected,
			               				[Styles['NetworkDropdown__circle-green']]: openBrowserEnabled
			           				})}
				        		/>
				        		<div className={Styles.NetworkDropdown__labelText}>
				        			{connections[selectedKey] && connections[selectedKey].name}
				        		</div>
				        		<div className={Styles.NetworkDropdown__svg}>
				        			<ChevronFlip  pointDown={!this.state.menuIsOpen} />
				        		</div>
				        	</div>
			        	]
		        	}
		        >
		        	<div className={Styles.NetworkDropdown__dropdownLabel}>Networks</div>
		        	{options}
		        	<div key='break' className={Styles.NetworkDropdown__break}/>
		        	{userCreatedOptions}
		          	<div
		          		onClick={this.addNew}
		          		className={classNames(DropdownStyles.Dropdown__menuItem, Styles.NetworkDropdown__menuItem, Styles.NetworkDropdown__addNewButton)}
					>
						Add New
						<div className={Styles.NetworkDropdown__addNewSvg}/>
					</div>
		        </Dropdown>
			</section>
	  	)
	}
}
