import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard page!</p>
      <Link to="/countries">Go to Countries</Link>
    </div>
  );
};

export default Dashboard;
