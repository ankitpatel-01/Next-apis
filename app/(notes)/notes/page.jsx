'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formError, setFormError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            const res = await fetch(`/api/notes?page=${page}&limit=1`);
            if (res.status === 200) {
                const data = await res.json();
                setNotes(data.notes);
                setTotalPages(data.totalPages);
            } else if (res.status === 401) {
                router.push('/login');
            }
            setLoading(false); // Set loading to false after notes are fetched
        };

        fetchNotes();
    }, [page, router]);

    const handleCreateNote = async () => {
        if (!title.trim()) {
            setFormError('Title is required');
            return;
        }

        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (res.status === 201) {
            const data = await res.json();
            setNotes([data.note, ...notes]);
            setTitle('');
            setDescription('');
            setFormError('');
        } else {
            const errorData = await res.json();
            setFormError(errorData.message || 'Failed to create note');
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Notes</h1>
            <div className="mb-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                ></textarea>
                {formError && <p className="text-red-500 mb-2">{formError}</p>}
                <button
                    onClick={handleCreateNote}
                    className="w-full p-2 bg-blue-500 text-white rounded"
                >
                    Create Note
                </button>
            </div>
            {loading && notes.length === 0 && (
                <div className="flex items-center justify-center h-48">
                    <h2 className="text-2xl">Loading...</h2>
                </div>
            )}
            {!loading && notes.length === 0 && (
                <p className="text-lg">No notes found.</p>
            )}
            {notes.length > 0 && (
                <div className="flex flex-col w-60">
                    {notes.map((note) => (
                        <div key={note._id} className="p-4 border rounded bg-white mb-4">
                            <h2 className="text-xl font-bold">{note.title}</h2>
                            <p>{note.description}</p>
                        </div>
                    ))}
                    <div className="flex justify-between w-full mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page <= 1}
                            className="p-2 bg-gray-500 text-white rounded"
                        >
                            Previous
                        </button>
                        <div className="flex items-center">
                            <p className="mr-2">{`Page ${page} of ${totalPages}`}</p>
                            <button
                                onClick={handleNextPage}
                                disabled={page >= totalPages}
                                className="p-2 bg-gray-500 text-white rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesPage;
