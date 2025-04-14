function Footer() {
    return (
        <footer className="bg-primary text-white py-4" style={{marginTop: '100px'}}>
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center flex-column">
                    <div className="d-flex justify-content-between" style={{ width: '90%' }}>
                        <div className="text-start">
                            <h5>USEFUL LINKS</h5>
                            <ul className="list-unstyled">
                                <li><a href="/home" className="text-white">Home</a></li>
                                <li><a href="/shop" className="text-white">Shop</a></li>
                                <li><a href="/about" className="text-white">About Us</a></li>
                                <li><a href="/contact" className="text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div className="text-start">
                            <h5>CONTACT US</h5>
                            <ul className="list-unstyled">
                                <li className="pt-2"><i className="bi bi-envelope"></i> email@example.com</li>
                                <li className="pt-2"><i className="bi bi-whatsapp"></i> +1234567890</li>
                                <li className="pt-2"><i className="bi bi-telephone"></i> +0987654321</li>
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between pt-4" style={{ width: '90%', borderTop: 'solid 2px gold' }}>
                        <div className="text-start">
                            <p>&copy; 2024 MyStore. All rights reserved.</p>
                        </div>
                        <div className="text-starat" style={{width: '165px'}}>
                            <ul className="list-unstyled d-flex justify-content-start">
                                <li className="mx-2"><a href="#"><i className="bi bi-facebook text-white"></i></a></li>
                                <li className="mx-2"><a href="#"><i className="bi bi-twitter text-white"></i></a></li>
                                <li className="mx-2"><a href="#"><i className="bi bi-instagram text-white"></i></a></li>
                                <li className="mx-2"><a href="#"><i className="bi bi-linkedin text-white"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
