'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { DataList }  from './PageData/components/DataList.jsx';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../resources/static/bundle.css';


ReactDOM.render(
	<DataList />,
	document.getElementById('react')
);
