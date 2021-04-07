import React from 'react';
import PropTypes from "prop-types";

import Entry from './Entry'

const EntryList = (data: any) => {
  console.log(data)
  return (
    <div>
      {data.map((entry: any) => (<Entry  data={entry}/>))} 
      
    </div>
  );
}

EntryList.propTypes = {
  data: PropTypes.object.isRequired
};

export default EntryList;