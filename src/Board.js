import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: [...clients],
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'backlog'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane className="Swimlane-column" name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];

    const drake = Dragula(containers, {
      moves: (el, container, handle) => {
        return true;
      },
      accepts: (el, target, source, sibling) => {
        return true;
      },
      direction: 'vertical',
      revertOnSpill: true
    });

    drake.on('drop', (el, target, source, sibling) => {
      const targetStatus = target.getAttribute('data-status');
      const sourceStatus = source.getAttribute('data-status');
      const id = el.getAttribute('data-id');

      if (sourceStatus === targetStatus) {
        const newOrder = Array.from(target.children).map(child => 
          child.getAttribute('data-id')
        );

        this.setState(prevState => {
          const statusKey = targetStatus === 'in-progress' ? 'inProgress' : targetStatus;
          const reorderedClients = newOrder.map(clientId => 
            prevState.clients[statusKey].find(c => c.id === clientId)
          );

          return {
            clients: {
              ...prevState.clients,
              [statusKey]: reorderedClients
            }
          };
        });
      } else {
        this.setState(prevState => {
          
          const sourceKey = sourceStatus === 'in-progress' ? 'inProgress' : sourceStatus;
          const targetKey = targetStatus === 'in-progress' ? 'inProgress' : targetStatus;
          
          const clientToMove = prevState.clients[sourceKey].find(c => c.id === id);
          const updatedClient = { ...clientToMove, status: targetStatus };

          
          const sourceClients = prevState.clients[sourceKey].filter(c => c.id !== id);
          
          
          const targetClients = [...prevState.clients[targetKey]];
          const siblingIndex = sibling 
            ? targetClients.findIndex(c => c.id === sibling.getAttribute('data-id'))
            : targetClients.length;
          
          targetClients.splice(siblingIndex, 0, updatedClient);

          return {
            clients: {
              ...prevState.clients,
              [sourceKey]: sourceClients,
              [targetKey]: targetClients
            }
          };
        });
      }
    });
  }
  
  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
