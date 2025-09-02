import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Notes App</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span>Hello, {user.name}</span>
              <button 
                onClick={logout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;