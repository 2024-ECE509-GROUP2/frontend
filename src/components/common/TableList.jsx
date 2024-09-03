export default function TableList({headings=[] , children}) {

    const headers = headings.map( heading => {
        return (
            <>
                <th scope="col">{heading}</th>
            </>
        )
    })

    return (
        <>
            <div class="table-responsive py-5">
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </>
    )
}