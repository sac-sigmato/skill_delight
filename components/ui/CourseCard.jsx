function CourseCard({ course }) {
  const [enquiryCourse, setEnquiryCourse] = useState("");

  return (
    <div className="border rounded p-4">
      <h3>{course.title}</h3>
      <p>{course.description}</p>

      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={() => setEnquiryCourse(course.title)}>
            Enquiry Now
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enquiry for {enquiryCourse}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <input placeholder="Name" className="w-full p-2 border rounded" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input placeholder="Phone" className="w-full p-2 border rounded" />
            <input
              placeholder="Country"
              className="w-full p-2 border rounded"
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
