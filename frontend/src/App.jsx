import { useEffect, useState } from 'react';
import { getUsers } from './services/api.js';
import { registerUser, loginUser } from './services/authService.js';
import { getPosts } from './services/wordpressService.js';
import './App.css';


export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    if (!localStorage.getItem('authToken')) return;
    getUsers({ search, role, page, limit })
      .then((data) => setUsers(Array.isArray(data?.user) ? data.user : Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los usuarios. Comprueba que el backend esté disponible.'));
  }, [search, role, page, limit, currentUser]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await loginUser(loginData);
      if (!result?.token) throw new Error('La respuesta no contiene un token de acceso.');
      localStorage.setItem('authToken', result.token);
      setCurrentUser(result.user || { email: loginData.email });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
      setLoginData({ email: '', password: '' });
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser(newUser);
      setNewUser({ name: '', email: '', password: '' });
      setShowLogin(true);
      setError('Registro exitoso. Ya puedes iniciar sesión.');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setUsers([]);
    setError('');
  };

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isLoggedIn){
      fetchUsers();
      fetchPosts();
    }
  },[search, role, page, limit, isLoggedIn]);



  return (
    <main className="App">
      <h1>User Management</h1>
      {currentUser ? (
        <section>
          <h2>Bienvenido, {currentUser.name || currentUser.email}</h2>
          <button type="button" onClick={handleLogout}>Cerrar sesión</button>
          <h2>Usuarios</h2>
          <div className="filters">
            <input aria-label="Buscar usuarios" placeholder="Buscar..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
            <select aria-label="Filtrar por rol" value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }}>
              <option value="">Todos los roles</option><option value="admin">Admin</option><option value="user">User</option>
            </select>
          </div>
          <table><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
            <tbody>{users.map((user) => <tr key={user._id || user.email}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>)}</tbody>
          </table>
          <div className="pagination">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Anterior</button>
            <span>Página {page}</span>
            <button type="button" onClick={() => setPage((value) => value + 1)}>Siguiente</button>
            <select aria-label="Usuarios por página" value={limit} onChange={(event) => setLimit(Number(event.target.value))}><option value={5}>5 por página</option><option value={10}>10 por página</option><option value={50}>50 por página</option></select>
          </div>
        </section>
      ) : showLogin ? (
        <section><h2>Iniciar sesión</h2>
          <form onSubmit={handleLoginSubmit}>
            <input type="email" placeholder="Email" autoComplete="email" required value={loginData.email} onChange={(event) => setLoginData({ ...loginData, email: event.target.value })} />
            <input type="password" placeholder="Contraseña" autoComplete="current-password" required value={loginData.password} onChange={(event) => setLoginData({ ...loginData, password: event.target.value })} />
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</button>
          </form>
          <button type="button" onClick={() => { setError(''); setShowLogin(false); }}>Crear una cuenta</button>
        </section>
      ) : (
        <section><h2>Crear cuenta</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input type="text" placeholder="Nombre" autoComplete="name" required value={newUser.name} onChange={(event) => setNewUser({ ...newUser, name: event.target.value })} />
            <input type="email" placeholder="Email" autoComplete="email" required value={newUser.email} onChange={(event) => setNewUser({ ...newUser, email: event.target.value })} />
            <input type="password" placeholder="Contraseña" autoComplete="new-password" required value={newUser.password} onChange={(event) => setNewUser({ ...newUser, password: event.target.value })} />
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando…' : 'Registrarse'}</button>
          </form>
          <button type="button" onClick={() => { setError(''); setShowLogin(true); }}>Volver a iniciar sesión</button>
        </section>
      ) (  
        <section>
          <h2>Wordpress Posts</h2>
          <ul>
            {posts.map((post) => {
              <li key = {post.id}>
                <h3>{post.title.rendered}</h3>
                <div dangerouslySetInnerHTML={{__html: post.content.rendered }}/>
              </li>
            })}
          </ul>
        </section>
      )}
      {error && <p role="status">{error}</p>}
    </main>
  );
}
