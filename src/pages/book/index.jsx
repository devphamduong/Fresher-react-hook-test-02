import { useLocation } from 'react-router-dom';

function BookPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    return (
        <>
            book
        </>
    );
}

export default BookPage;