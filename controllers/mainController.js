exports.renderMainPage = (req, res) => {
    res.render('index', {
        title: 'Main Page',
        message: 'Welcome to the File Management System'
    });
};
