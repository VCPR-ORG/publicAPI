var authRequestParams = {
    url: pm.collectionVariables.get('baseUrl') + '/api/users/logins',
    header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};
if (pm.environment.has('authToken')) {
    authRequestParams.method = 'GET';
    authRequestParams.header['x-auth-token'] = pm.environment.get('authToken');
} else {
    authRequestParams.method = 'POST';
    authRequestParams.body = {
        mode: 'raw',
        raw: JSON.stringify({
            apikey: pm.environment.get('apikey'),
            identifier: pm.environment.get('username'),
            password: pm.environment.get('password')
        })
    }
}
pm.sendRequest(authRequestParams, (err, res) => {
    if (err) {
        console.error('Failed to authenticate', err);
        return;
    }
    var data = res.json();
    pm.environment.set('authToken', data.token);
    pm.environment.set('userId', data.user.id);
    pm.request.headers.add({ key: 'x-auth-token', value: data.token });
});