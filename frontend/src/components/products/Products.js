import React from 'react'
import { Link } from 'react-router-dom'



const Products = ({product,col}) => {

  const url='https://res.cloudinary.com/dg9gicndn/image/upload/v1611164897/products/tgpohrt5eq9g28i19ppa.jpg'

  console.log(product.images[0]);

    return (
    
             <div  className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={product.images[0].url?product.images[0].url:`${url}`}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
          <Link to={`/product/${product._id}`} >{product.name}</Link>
          </h5>
          <div className="ratings mt-auto">
            {/* <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star-half-o"></i>
            <i className="fa fa-star-o"></i> */}
                            <div className="rating-outer">
                    <div className="rating-inner"    style={{ width: `${ (product.ratings/5)*100 }%`}} ></div>

 
                </div>
            {/* <div className="ratings-outer">
              <div className="ratings-inner" style={{ width: `${ (product.ratings/5)*100 }%`}}></div>
            </div> */}
            <span id="no_of_reviews">({product.numofEeviews} Reviews)</span>
          </div>
          <p className="card-text">${product.price}</p>
          <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
        </div>
      </div>
    </div>
            
         )
}

export default Products
