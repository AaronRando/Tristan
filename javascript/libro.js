window.onload=function(){
    const params = new URLSearchParams(window.location.search);
    const id = decodeURIComponent(params.get("id"));
    if (!id || id === "null") {
        window.location.href = "index.html";
    }
    else {
        const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=libros&id="+id;
        fetch(url)
            .then(function (respuesta) {
                if (!respuesta.ok) {
                    throw new Error("Error en el fetch: " + respuesta.status);
                }
                const contentType = respuesta.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    return respuesta.json(); // Es un JSON
                } else {
                    return respuesta.text(); // Es HTML o algo diferente
                }
            })
            .then(function (datos) {
                datos=datos[0];
                const nombre = document.getElementById("nombre");
                nombre.innerHTML += datos.titulo;
                const descripcion = document.getElementById("descripcion");
                descripcion.innerHTML += datos.descripcion;
                const año = document.getElementById("año");
                año.innerHTML += datos.fecha_publicacion;
                const paginas = document.getElementById("paginas");
                paginas.innerHTML += datos.paginas;
                const imagen = document.getElementById("imagen");
                imagen.src = datos.imagen;
                imagen.alt = datos.titulo;
                window.ruta = datos.ruta_libro; 
                const autor = document.getElementById("autor");
                if (datos.id_autor==1) {
                    autor.innerHTML+="Anonimo";
                }
                else {
                    const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=autor&id="+datos.id_autor;
                    fetch(url)
                        .then(function (respuesta) {
                            if (!respuesta.ok) {
                                throw new Error("Error en el fetch: " + respuesta.status);
                            }
                            const contentType = respuesta.headers.get('Content-Type');
                            if (contentType && contentType.includes('application/json')) {
                                return respuesta.json(); // Es un JSON
                            } else {
                                return respuesta.text(); // Es HTML o algo diferente
                            }
                        })
                        .then(function (datos) {
                            const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=usuarios&id="+datos[0].id_usuario;
                            fetch(url)
                                .then(function (respuesta) {
                                    if (!respuesta.ok) {
                                        throw new Error("Error en el fetch: " + respuesta.status);
                                    }
                                    const contentType = respuesta.headers.get('Content-Type');
                                    if (contentType && contentType.includes('application/json')) {
                                        return respuesta.json(); // Es un JSON
                                    } else {
                                        return respuesta.text(); // Es HTML o algo diferente
                                    }
                                })
                                .then(function (datos) {
                                    autor.href="autor.html?id="+datos[0].id;
                                    autor.textContent = datos[0].nombre;
                                    
                                })
                                .catch(function (error) {
                                    alert("Error accediendo a la url: " + error);
                                });
                        })
                        .catch(function (error) {
                            alert("Error accediendo a la url: " + error);
                        });
                }
                const url = "http://localhost/TRISTAN/Login-v2/Api/api.php?tabla=categorias&id="+datos.id_categoria;
                fetch(url)
                    .then(function (respuesta) {
                        if (!respuesta.ok) {
                            throw new Error("Error en el fetch: " + respuesta.status);
                        }
                        const contentType = respuesta.headers.get('Content-Type');
                        if (contentType && contentType.includes('application/json')) {
                            return respuesta.json(); // Es un JSON
                        } else {
                            return respuesta.text(); // Es HTML o algo diferente
                        }
                    })
                    .then(function (datos) {
                        const categoria = document.getElementById("categoria");
                        categoria.innerHTML += datos[0].nombre;
                    })
                    .catch(function (error) {
                        alert("Error accediendo a la url: " + error);
                    });
            })
            .catch(function (error) {
                alert("Error accediendo a la url: " + error);
            });
    }
    
}