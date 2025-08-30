export function Title({session}) {
    return <div className='title'>
        <h1>{session.description}</h1>
        <h2>{session.subtitle}</h2>
    </div>;
}
