import { useState, useEffect } from 'react';

const Admin = () => {
    const [redirects, setRedirects] = useState([]);
    const [source, setSource] = useState('');
    const [redirectId, setRedirectId] = useState(0);
    const [destination, setDestination] = useState('');
    const [permanent, setPermanent] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        const getRedirects = async () => {
            const res = await fetch('/api/redirects');
            const data = await res.json();
            setRedirects(data);
        };
        getRedirects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editing ? "PUT" : "POST";
        const res = await fetch('/api/redirects', {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: editing && redirectId, source, destination, permanent })
        });
        const data = await res.json();
        if (editing) {
            setRedirects(redirects.map(r => (r.id === data.id ? data : r)));
            setEditing(null);
        } else {
            setRedirects([...redirects, data]);
        }
        setSource('');
        setDestination('');
        setPermanent(false);
    };

    const handleEdit = (redirect) => {
        setRedirectId(redirect.id);
        setEditing(true);
        setSource(redirect.source);
        setDestination(redirect.destination);
        setPermanent(redirect.permanent);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/redirects?id=${id}`, { method: 'DELETE' });
            setRedirects(redirects.filter(r => r.id !== id));
            console.log('Deleted Successfully');
        } catch (error) {
            console.log('Something went wrong.');
        }
    };

    return (
        <div className='w-full max-w-xs' style={{ margin: "10px auto" }}>
            <h2>Rediect Manager</h2>
            <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <input
                    type='text'
                    placeholder='Source'
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <br /><br />
                <input
                    type='text'
                    placeholder='Destination'
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                />
                <br /><br />
                <input
                    type='checkbox'
                    placeholder='Source'
                    checked={permanent}
                    onChange={(e) => setPermanent(e.target.checked)}
                />
                <br /><br />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type='submit'>{editing ? 'Update' : 'Add'} Redirect</button>
            </form>
            <ul>
                {redirects.map(redirect => (
                    <li key={redirect.id}>
                        {redirect.source} {"=>"} {redirect.destination} {`(${redirect.permanent ? 'Permanent' : 'Temporary'})`}
                        <button onClick={() => handleEdit(redirect)}>Edit</button>
                        <button onClick={() => handleDelete(redirect.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;