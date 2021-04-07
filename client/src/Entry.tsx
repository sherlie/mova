import React from 'react';
import PropTypes from "prop-types";


const Entry = (data: any) => {
  console.log(data)
  
  return (
    <div>
      {data.origin}
    </div>
  );
}

Entry.propTypes = {
  data: PropTypes.object.isRequired
};

export default Entry;