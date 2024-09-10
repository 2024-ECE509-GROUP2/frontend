export default function FormDropdown() {

    return(
        <>
            <label htmlFor="selectProgramme">Select Programme</label>
            <select className="" name="selectProgramme" value={programmes.selected} onChange={handleFormUpdate}>
                <option value=""></option>
                {options}
            </select>
        </>
    )
}