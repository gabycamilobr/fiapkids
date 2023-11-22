const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/fiapkids',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});

const UsuarioSchema = new mongoose.Schema({
    nome : { type : String},
    email : {type : String, required : true},
    senha : { type : String}
});

const Usuario = mongoose.model("Usuário", UsuarioSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    const usuario = new Usuario({
        nome : nome,
        email : email,
        senha : senha
    })

    if(nome == null || email == null || senha == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    }

    const emailExiste = await Usuario.findOne({email:email});

    if(emailExiste){
        return res.status(400).json({error : "Esse email já está registrado no sistema"});
    }
 
    try{
        const newUsuario = await usuario.save();
        res.json({error : null, msg : "Cadastro ok", usuarioId : newUsuario._id});
    } catch(error){
        res.status(400).json({error});
    }

});


const ProdutoSchema = new mongoose.Schema({
    codigo : {type : Number, required : true},
    descricao : {type : String},
    fornecedor : {type : String},
    data_fabricacao : {type : Date},
    qnt_estoque : {type : Number}
});

const Produto = mongoose.model("Produto", ProdutoSchema);

app.post("/cadastroproduto", async(req, res)=>{
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const data_fabricacao = req.body.data_fabricacao;
    const qnt_estoque = req.body.qnt_estoque;

    if(codigo == null || descricao == null || fornecedor == null || data_fabricacao == null || qnt_estoque == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    }
 
    const codigoExiste = await Produto.findOne({codigo : codigo});
 
    if(codigoExiste){
        return res.status(400).json({error : "Esse código já está registrado no sistema"});
    }

    const produto = new Produto({
        codigo : codigo,
        descricao : descricao,
        fornecedor : fornecedor,
        data_fabricacao : data_fabricacao,
        qnt_estoque : qnt_estoque
    })

    try{
        const newProduto = await produto.save();
        res.json({error : null, msg : "Cadastro ok", usuarioCodigo : newProduto.codigo});
    } catch(error){
        res.status(400).json({error});
    }

});


app.get("/cadastrousuario", async(req, res)=> {
    res.sendFile(__dirname+"/cadastrousuario.html");
});

app.get("/cadastroproduto", async(req, res)=> {
    res.sendFile(__dirname+"/cadastroproduto.html");
});

app.get("/index", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
});


app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
});