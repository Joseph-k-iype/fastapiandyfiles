// import './App.css'
// import logo from './assets/yWorksLogo.png'
// import ReactGraphComponent from './components/ReactGraphComponent'
// import Toolbar from './components/Toolbar'
// import ReactGraphOverviewComponent from './components/GraphOverviewComponent'
// import { UserInputDialog } from './components/UserInputDialog'
// import { GraphComponentProvider } from './components/GraphComponentProvider'
// import { Tooltip } from './components/Tooltip'
// import { ContextMenuComponent } from './components/ContextMenuComponent'
// import AppDropdown from './components/AppDropdown'

// function App() {
//   function setSelectedAppId(appId: string): void {
//     throw new Error('Function not implemented.')
//   }

//   return (
//     // <div className="app">
//     //   <GraphComponentProvider>
//     //   <div className="header">
//     //       <div className="title">Application Visualizer</div>
//     //       <Toolbar />
//     //       <AppDropdown onSelectApp={setSelectedAppId} />
//     //     </div>
//     //     <UserInputDialog />
//     //     <div className="main">
//     //     {setSelectedAppId && <ReactGraphComponent appId={setSelectedAppId} />}
//     //       <ContextMenuComponent />
//     //       <Tooltip />
//     //     </div>
//     //     <div style={{ position: 'absolute', left: '20px', top: '68px' }}>
//     //       <ReactGraphOverviewComponent />
//     //     </div>
//     //     <div style={{ position: 'absolute', bottom: '20px', right: '15px' }}>
//     //       <a
//     //         href="https://yworks.com"
//     //         target="_blank"
//     //         rel="noopener noreferrer"
//     //         style={{ margin: '10px' }}
//     //       >
//     //         <img
//     //           src={logo}
//     //           style={{ height: '50px', width: '50px' }}
//     //           alt="yWorks Logo"
//     //         />
//     //       </a>
//     //     </div>
//     //   </GraphComponentProvider>
//     // </div>
//     <div className="app">
//     <GraphComponentProvider>
//       <div className="header">
//         <div className="title">Application Visualizer</div>
//         <Toolbar />
//         <AppDropdown onSelectApp={setSelectedAppId} />
//       </div>
//       <UserInputDialog />
//       <div className="main">
//         {setSelectedAppId && <ReactGraphComponent appId={setSelectedAppId} />}
//         <ContextMenuComponent />
//         <Tooltip />
//       </div>
//       <ReactGraphOverviewComponent />
//       <a href="https://yworks.com" target="_blank" rel="noopener noreferrer">
//         <img src={logo} alt="yWorks Logo" style={{ position: 'absolute', bottom: '20px', right: '15px', height: '50px', width: '50px' }} />
//       </a>
//     </GraphComponentProvider>
//   </div>
// );
// }

// export default App



// // App.tsx
// // import React, { useState } from 'react';
// // import './App.css';
// // import AppDropdown from './components/AppDropdown';
// // import ReactGraphComponent from './components/ReactGraphComponent';
// // import Toolbar from './components/Toolbar';
// // import {GraphComponentProvider} from './components/GraphComponentProvider';
// // import {UserInputDialog} from './components/UserInputDialog';
// // import Tooltip from './components/Tooltip';
// // import {ContextMenuComponent} from './components/ContextMenuComponent';
// // import GraphOverviewComponent from './components/GraphOverviewComponent';
// // import logo from './assets/yWorksLogo.png';

// // function App() {
// //   const [selectedAppId, setSelectedAppId] = useState<string>('');

// //   return (
// //     <div className="app">
// //       <GraphComponentProvider>
// //         <div className="header">
// //           <div className="title">Application Visualizer</div>
// //           <Toolbar />
// //           <AppDropdown onSelectApp={setSelectedAppId} />
// //         </div>
// //         <UserInputDialog />
// //         <div className="main">
// //           {selectedAppId && <ReactGraphComponent appId={selectedAppId} />}
// //           <ContextMenuComponent />
// //           <Tooltip title={''} content={''} />
// //         </div>
// //         <GraphOverviewComponent />
// //         <a href="https://yworks.com" target="_blank" rel="noopener noreferrer">
// //           <img src={logo} alt="yWorks Logo" style={{ position: 'absolute', bottom: '20px', right: '15px', height: '50px', width: '50px' }} />
// //         </a>
// //       </GraphComponentProvider>
// //     </div>
// //   );
// // }

// // export default App;


import React, { useState } from 'react';
import './App.css';
import AppDropdown from './components/AppDropdown';
import ReactGraphComponent from './components/ReactGraphComponent';
import Toolbar from './components/Toolbar';
import {GraphComponentProvider} from './components/GraphComponentProvider';
import {UserInputDialog} from './components/UserInputDialog';
import Tooltip from './components/Tooltip';
// import {ContextMenuComponent} from './components/ContextMenuComponent';
import GraphOverviewComponent from './components/GraphOverviewComponent';
import logo from './assets/yWorksLogo.png';
import ReactGraphOverviewComponent from './components/GraphOverviewComponent';
import { ContextMenuComponent } from './components/ContextMenuComponent';

function App() {
  // Proper state management to hold the selected application ID
  const [selectedAppId, setSelectedAppId] = useState<string>('');

  return (
    <div className="app">
      <GraphComponentProvider>
        <div className="header">
          <div className="title">Application Visualizer</div>
          <Toolbar />
          <AppDropdown onSelectApp={setSelectedAppId} />
        </div>
        <UserInputDialog />
        <div className="main">
          {/* Only render ReactGraphComponent if selectedAppId is not empty */}
          {selectedAppId && <ReactGraphComponent appId={selectedAppId} />}
          <ReactGraphOverviewComponent />
          <ReactGraphComponent appId={'1002'} />
        <ContextMenuComponent />
          <Tooltip title={''} content={''} />
          
        </div>
        
        <a href="https://yworks.com" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="yWorks Logo" style={{ position: 'absolute', bottom: '20px', right: '15px', height: '50px', width: '50px' }} />
        </a>
      </GraphComponentProvider>
    </div>
  );
}

export default App;
