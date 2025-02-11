import React from "react";

const Home = () => {
  return (
    <div>
      <h1>Welcome to College Event Management</h1>
      <p>Discover and participate in college events.</p>
    </div>
  );
};

export default Home;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
