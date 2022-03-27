const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const mongoose= require("mongoose");

const app = express();

const port = "4000";

app.use(express.json());

//-----------------------------------------------connect to database----------------------------------------------

const connectdb= ()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/erelationship");
}

// ====================================================section schema=============================================
const sectionSchema= new mongoose.Schema({
    section:{type:String,required:true},
    bookId:[{type:mongoose.Schema.Types.ObjectId,ref:"book"}]

},
{
    versionKey:false
});


//-------------------------------------------------- section model------------------------------------------------

const Section = mongoose.model("section",sectionSchema);


// ===================================================Book Schema=================================================

const bookSchema = new mongoose.Schema({
    bookName:{type:String,required:true},
    bookBody:{type:String,required:true},
    secId:{type:mongoose.Schema.Types.ObjectId,ref:"section"},
    authorId:{type:mongoose.Schema.Types.ObjectId,ref:"author"}
},{
  versionKey:false
});

// -----------------------------------------------------book model-------------------------------------------------
const Book = mongoose.model("book",bookSchema);


// =====================================================Author Schema=====================================================
const authorSchema = mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    bookId:{type:mongoose.Schema.Types.ObjectId,ref:"book"}
},{
    versionKey:false
});

// author model

const Author = mongoose.model("author",authorSchema);









// -----------------------------------------------------Controllers--------------------------------------------

app.get("/sections",async(req,res)=>{
    try{
        const sections = await Section.find().populate({path:"bookId",select:{"_id":1,"bookName":1,"authorId":1}}).lean().exec();
        return res.status(200).send(sections);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(500).send("Something went wrong"+error);
    }

})


app.post("/sections",async(req,res)=>{
    try{
        const sections = await Section.create(req.body);
        return res.status(200).send(sections);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(500).send("Something went wrong"+error);
    }
})


app.patch("/sections/:uid",async(req,res)=>{
    try{
        const sections = await Section.findByIdAndUpdate(req.params.uid, req.body, {new:true});
        return res.status(200).send(sections);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(500).send("Something went wrong"+error);
    }
});

app.get("/sections/:uid",async(req,res)=>{
    try{
        const sections = await Section.findById(req.params.uid).lean().exec();
        return res.status(200).send(sections);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(500).send("Something went wrong"+error);
    }
})

app.delete("/sections/:uid",async(req,res)=>{
    try{
        const sections = await Section.findByIdAndDelete(req.params.uid);
        return res.status(200).send(sections);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(500).send("Something went wrong"+error);
    }
})






// ---------------------------------------------Book controller--------------------------------------------------
app.get("/books",async(req,res)=>{
    try{
        const books = await Book.find().populate({path:"secId",select:["section"]}).lean().exec();
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.post("/books",async(req,res)=>{
    try{
        const books = await Book.create(req.body);
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.patch("/books/:id",async(req,res)=>{
    try{
        const books = await Book.findByIdAndUpdate(req.params.id, req.body, {new:true});
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.get("/books/:id",async(req,res)=>{
    try{
        const books = await Book.findById(req.params.id).populate({path:"secId",select:["section"]}).lean().exec();
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.get("/books/:id/author",async(req,res)=>{
    try{
        const books = await Book.find({authorId:req.params.id});
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.get("/books/:id/section",async(req,res)=>{
    try{
        const books = await Book.find({secId:req.params.id});
        return res.status(200).send(books);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

// --------------------------------------------------------------Author Controller---------------------------------------
app.get("/authors",async(req,res)=>{
    try{
        const authors = await Author.find().populate({path:"bookId",select:{"bookName":1,"secId":1,"_id":0},populate:{path:"secId",select:{"section":1,"_id":0}}}).lean().exec();
        return res.status(200).send(authors);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})


app.post("/authors",async(req,res)=>{
    try{
        const authors = await Author.create(req.body);
        return res.status(200).send(authors);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})

app.patch("/authors/:id",async(req,res)=>{
    try{
        const authors = await Author.findByIdAndUpdate(req.params.id, req.body,{new:true});
        return res.status(200).send(authors);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
});

app.get("/authors/:id",async(req,res)=>{
    try{
        const authors = await Author.findById(req.params.id).populate({path:"bookId",select:{"bookName":1,"secId":1,"_id":0},populate:{path:"secId",select:{"section":1,"_id":0}}}).lean().exec();
        return res.status(200).send(authors);
    }
    catch(error){
        console.log("Something went wrong"+error);
        return res.status(5000).send("Something went wrong"+error);
    }
})





app.listen(port,async()=>{
    try{
        await connectdb();
        console.log(`listening on port no ${port}`);
    }
    catch(err){
        console.log(`Something went wrong ${err}`);
    }
})



