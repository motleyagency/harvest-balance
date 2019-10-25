import React, { useState } from 'react';
import { projectBalance } from '../../util/harvestBalance';

function ProjectsSection() {
  const [data, setData] = useState({});
  const handleSubmit = async (startDate, endDate) => {
    const balance = await projectBalance({
      startDate: '20191021',
      endDate: '20191025',
    });
    setData(balance);

    console.log(balance);
  };

  return (
    <h1>
      Projects
      <button onClick={() => handleSubmit()}>Click me</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </h1>
  );
}

export default ProjectsSection;
