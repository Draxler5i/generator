const resStructure = {
    Error: {
        title: "",
        message: ""
    },
    Success: {
        message: ""
    }
}

const response = (error, success, title) => {
    let response = { title };
    if (error) {
        return response.Error = { message: error }
    }
    return response.Success = { message: success }
}

module.exports = response;