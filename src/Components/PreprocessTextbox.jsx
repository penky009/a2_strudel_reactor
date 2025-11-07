function PreprocessTextbox({ defaultValue, onChange }) {
    return (
        <>
            <textarea className="form-control" rows="15" defaultValue={defaultValue} onChange={onChange} id="proc" style={{ height: '100%', resize: 'none' }} ></textarea>
        </>
    );
}

export default PreprocessTextbox;