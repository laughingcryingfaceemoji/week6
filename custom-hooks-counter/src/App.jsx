// AppWithCustomHook.jsx
import useField from './useField';
import './App.css';  // Add CSS if needed
import useLocalStorage from './useLocalStorage';

const AppWithCustomHook = () => {
  const nameInput = useField('text');
  const bornInput = useField('date');
  const heightInput = useField('number');
  const [name, setName] = useLocalStorage('name', '');
 
  const handleSubmit = (event) => {

 event.preventDefault();
    // You can handle form submission logic here
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Name: <input {...nameInput} /> */}
          Name: <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
       />
        </div>
        <br/>
        <div>
          Birthdate: <input {...bornInput} />
        </div>
        <br/>
        <div>
          Height: <input {...heightInput} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        {nameInput.value} {bornInput.value} {heightInput.value}
      </div>
      <div>
      
      <p>Your name is stored in localStorage: {name}</p>
    </div>
    </div>
  );
};

export default AppWithCustomHook;