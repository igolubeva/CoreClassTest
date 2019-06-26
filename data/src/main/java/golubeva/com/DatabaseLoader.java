
package golubeva.com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final SourceRepository repository;

	@Autowired
	public DatabaseLoader(SourceRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {

		this.repository.save(new Source("Frodo", "Baggins"));
		this.repository.save(new Source("Bilbo", "Baggins"));
		this.repository.save(new Source("Gandalf", "the Grey"));
		this.repository.save(new Source("Samwise", "Gamgee"));
		this.repository.save(new Source("Meriadoc", "Brandybuck"));
		this.repository.save(new Source("Peregrin", "Took"));
	}
}
// end::code[]