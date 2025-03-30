import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return <div className="container-default">{children}</div>;
};

export default Container;
