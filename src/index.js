const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/delete', (req, res) => {
    res.render('delete')
})

app.get('/update', (req, res) => {
    res.render('update'); 
});

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('welcome')
})



app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        phonenumber:req.body.phonenumber,
        email:req.body.email,
        password: req.body.password
    }

    try {
        
        const checking = await LogInCollection.findOne({ name: req.body.name })
      

        if (checking) {
            res.send("Username already exists")
        } else {
           
            await LogInCollection.insertMany([data])
            res.render("home")
        }
    } catch (error) {
        res.send("An error occurred")
    }
})





app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {
        res.send("wrong details")    

    }

})




app.post('/delete', async (req, res) => {
    try {
        const { name } = req.body;

       
        const user = await LogInCollection.findOne({ name });

   
        if (!user) {
            return res.status(404).send("User not found");
        }

        
        await LogInCollection.deleteOne({ name });

        res.status(200).send("User deleted successfully");
    } catch (error) {
        res.status(500).send("An error occurred while deleting user");
    }
});


app.post('/update', async (req, res) => {
    try {
        const { name, newPassword } = req.body;

       
        const user = await LogInCollection.findOne({ name });

        if (!user) {
            return res.status(404).send("User not found");
        }

        
        user.password = newPassword;

        
        await user.save();

        res.status(200).send("User data updated successfully");
    } catch (error) {
        res.status(500).send("An error occurred while updating user data");
    }
});




app.listen(port, () => {
    console.log('port connected');
})


