import '../components/scoreboard.css'

//handles inputs and resets
const Controller = ({ handleChange, handleSubmit, handleReset}) => {
    return (
        <div>
                <form onSubmit={handleSubmit}>
                    <label>
                    Input Rolls Here!
                        <input type="text" onChange={handleChange} />  
                    </label>

                     
                    <input type="submit" value="Enter" />
                </form>
                <div className="space"/>
                <div>
                    <button onClick={() => handleReset()}>
                        Reset
                    </button>
                </div>
        </div>
    )
}

export default Controller